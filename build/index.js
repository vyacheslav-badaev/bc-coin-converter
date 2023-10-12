var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsxDEV } from "react/jsx-dev-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 48,
          columnNumber: 13
        },
        this
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 98,
          columnNumber: 13
        },
        this
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var links = () => [
  ...void 0 ? [{ rel: "stylesheet", href: void 0 }] : []
];
function App() {
  return /* @__PURE__ */ jsxDEV2("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 20,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(
        "meta",
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        void 0,
        !1,
        {
          fileName: "app/root.tsx",
          lineNumber: 21,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 25,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 26,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 19,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { children: [
      /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 29,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 30,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 31,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 32,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 28,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 18,
    columnNumber: 9
  }, this);
}

// app/routes/api._index/route.tsx
var route_exports = {};
__export(route_exports, {
  loader: () => loader
});
import { json } from "@remix-run/node";
async function loader() {
  return json({
    message: "Welcome API Base Route"
  });
}

// app/routes/api.logout/route.tsx
var route_exports2 = {};
__export(route_exports2, {
  loader: () => loader2
});
import { json as json2 } from "@remix-run/node";

// app/lib/utils.ts
var fetchQueriesFromRequest = (req) => {
  let url = new URL(req.url), queries = {};
  for (let [key, value] of url.searchParams.entries())
    queries[key] = value;
  return queries;
};

// app/routes/api.logout/route.tsx
async function loader2({ request }) {
  let queries = fetchQueriesFromRequest(request);
  return console.log("queries", queries), json2({
    message: "TEST API Base Route"
  });
}

// app/routes/api.auth/route.tsx
var route_exports3 = {};
__export(route_exports3, {
  loader: () => loader3
});
import { json as json3 } from "@remix-run/node";
async function loader3({ request }) {
  let queries = fetchQueriesFromRequest(request);
  return console.log("queries", queries), json3({
    message: "TEST API Base Route"
  });
}

// app/routes/api.load/route.tsx
var route_exports4 = {};
__export(route_exports4, {
  loader: () => loader4
});
import { json as json4 } from "@remix-run/node";
async function loader4({ request }) {
  let queries = fetchQueriesFromRequest(request);
  return console.log("queries", queries), json4({
    message: "TEST API Base Route"
  });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  loader: () => loader5
});
import { json as json5 } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
async function loader5() {
  return json5({
    message: "Hello World!"
  });
}
function Index() {
  let { message } = useLoaderData();
  return /* @__PURE__ */ jsxDEV3("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV3("h1", { children: "My Blog" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 14,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("main", { children: message }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 15,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 13,
    columnNumber: 9
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-EZELMPFV.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-UCPS7GQO.js", "/build/_shared/chunk-W5GFZFBK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-JXEQESGR.js", imports: void 0, hasAction: !1, hasLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-J2XT4ZX2.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/api._index": { id: "routes/api._index", parentId: "root", path: "api", index: !0, caseSensitive: void 0, module: "/build/routes/api._index-PWGGDMS2.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/api.auth": { id: "routes/api.auth", parentId: "root", path: "api/auth", index: void 0, caseSensitive: void 0, module: "/build/routes/api.auth-LCQUSFUD.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/api.load": { id: "routes/api.load", parentId: "root", path: "api/load", index: void 0, caseSensitive: void 0, module: "/build/routes/api.load-APOWIZYS.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/api.logout": { id: "routes/api.logout", parentId: "root", path: "api/logout", index: void 0, caseSensitive: void 0, module: "/build/routes/api.logout-K4NC76WH.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 } }, version: "85aaba6a", hmr: { runtime: "/build/_shared/chunk-W5GFZFBK.js", timestamp: 1697118268903 }, url: "/build/manifest-85AABA6A.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = {}, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/api._index": {
    id: "routes/api._index",
    parentId: "root",
    path: "api",
    index: !0,
    caseSensitive: void 0,
    module: route_exports
  },
  "routes/api.logout": {
    id: "routes/api.logout",
    parentId: "root",
    path: "api/logout",
    index: void 0,
    caseSensitive: void 0,
    module: route_exports2
  },
  "routes/api.auth": {
    id: "routes/api.auth",
    parentId: "root",
    path: "api/auth",
    index: void 0,
    caseSensitive: void 0,
    module: route_exports3
  },
  "routes/api.load": {
    id: "routes/api.load",
    parentId: "root",
    path: "api/load",
    index: void 0,
    caseSensitive: void 0,
    module: route_exports4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
