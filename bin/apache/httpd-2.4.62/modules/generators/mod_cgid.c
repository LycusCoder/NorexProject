/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * http_script: keeps all script-related ramblings together.
 *
 * Compliant to cgi/1.1 spec
 *
 * Adapted by rst from original NCSA code by Rob McCool
 *
 * This modules uses a httpd core function (ap_add_common_vars) to add some new env vars, 
 * like REDIRECT_URL and REDIRECT_QUERY_STRING for custom error responses and DOCUMENT_ROOT.
 * It also adds SERVER_ADMIN - useful for scripts to know who to mail when they fail.
 * 
 */

#include "apr_lib.h"
#include "apr_strings.h"
#include "apr_general.h"
#include "apr_file_io.h"
#include "apr_portable.h"
#include "apr_buckets.h"
#include "apr_optional.h"
#include "apr_signal.h"

#define APR_WANT_STRFUNC
#include "apr_want.h"

#if APR_HAVE_SYS_SOCKET_H
#include <sys/socket.h>
#endif
#if APR_HAVE_UNISTD_H
#include <unistd.h>
#endif
#if APR_HAVE_SYS_TYPES_H
#include <sys/types.h>
#endif

#include "util_filter.h"
#include "httpd.h"
#include "http_config.h"
#include "http_request.h"
#include "http_core.h"
#include "http_protocol.h"
#include "http_main.h"
#include "http_log.h"
#include "ap_mpm.h"
#include "mpm_common.h"
#include "mod_suexec.h"
#include "../filters/mod_include.h"

#include "mod_core.h"


/* ### should be tossed in favor of APR */
#include <sys/stat.h>
#include <sys/un.h> /* for sockaddr_un */

#if APR_HAVE_STRUCT_RLIMIT
#if defined (RLIMIT_CPU) || defined (RLIMIT_NPROC) || defined (RLIMIT_DATA) || defined(RLIMIT_VMEM) || defined(RLIMIT_AS)
#define AP_CGID_USE_RLIMIT
#endif
#endif

module AP_MODULE_DECLARE_DATA cgid_module;

static int cgid_start(apr_pool_t *p, server_rec *main_server, apr_proc_t *procnew);
static int cgid_init(apr_pool_t *p, apr_pool_t *plog, apr_pool_t *ptemp, server_rec *main_server);

static apr_pool_t *pcgi = NULL;
static pid_t daemon_pid;
static int daemon_should_exit = 0;
static server_rec *root_server = NULL;
static apr_pool_t *root_pool = NULL;
static const char *sockname;
static struct sockaddr_un *server_addr;
static apr_socklen_t server_addr_len;
static pid_t parent_pid;
static ap_unix_identity_t empty_ugid = { (uid_t)-1, (gid_t)-1, -1 };

typedef struct { 
    apr_interval_time_t timeout;
} cgid_dirconf;

/* The APR other-child API doesn't tell us how the daemon exited
 * (SIGSEGV vs. exit(1)).  The other-child maintenance function
 * needs to decide whether to restart the daemon after a failure
 * based on whether or not it exited due to a fatal startup error
 * or something that happened at steady-state.  This exit status
 * is unlikely to collide with exit signals.
 */
#define DAEMON_STARTUP_ERROR 254

/* Read and discard the data in the brigade produced by a CGI script */
static void discard_script_output(apr_bucket_brigade *bb);

/* This doer will only ever be called when we are sure that we have
 * a valid ugid.
 */
static ap_unix_identity_t 