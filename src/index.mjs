var _ = require('underscore');
/**
 * Respond with content from R2 Bucket
 * @param {Request} request
 */
export default {
  async fetch(request, env) {
    if (request.method == "GET") {
      // const object = await env.MY_BUCKET.get(key);
      const mylist = await env.MY_BUCKET.list();
      const objects = Object.values(mylist.objects);
      const o = new Object();
      for (const [key, value] of Object.entries(objects)) {
        o[key] = value.uploaded
      }
      const maxProp = Object.entries(o)
          .reduce((bestEntry, thisEntry) => thisEntry[1] > bestEntry[1] ? thisEntry : bestEntry)
          [0];

      let pathname = Object.values(objects)[maxProp].key


      // no cache match, try reading from R2
      // we shouldn't need to try/catch here, but R2 seems to throw internal errrors right now when querying for a file that doesn't exist
      const file = await env.MY_BUCKET.get(pathname);

      if (file === undefined || file === null) {
        return new Response(
            JSON.stringify({
              success: false,
              error: "Object Not Found",
            }),
            {
              status: 404,
              headers: {
                "content-type": "application/json",
              },
            }
        );
      }


      return new Response(file.body, {
        headers: {
          "cache-control": "public, max-age=604800",
          "content-type": file.httpMetadata?.contentType,
          etag: file.httpEtag,
        },
      });

      // store in cache asynchronously, so to not hold up the request
      // ctx.waitUntil(cache.put(request, response.clone()));
    }

  // For any other http method, we just return a 404
  return new Response(null, {status: 404});
  }
};