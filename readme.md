Needs a wrangler.toml
'''
name = "r2-list-items"
type = "javascript"

account_id = <account_id>
workers_dev = true
compatibility_date = "2023-02-26"

[build.upload]
format = "modules"
dir = "./src"
main = "./index.mjs"

[[r2_buckets]]
bucket_name = <bucket_name>
binding = "MY_BUCKET"
'''

run wrangler init .
wrangler dev
to open development 
wrangler publish
to publish to your cloudflare
