class WadokuSearchClient < Sinatra::Base
  set :api_host, ENV["WADOKU_API_HOST"] || "http://localhost:10010"
  set :root, ROOT_DIR
  set :views, settings.root + "/app/views"
  set :static, true
end
