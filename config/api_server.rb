class WadokuSearchClient < Sinatra::Base
  set :api_host, "localhost:10010" || ENV["WADOKU_API_HOST"]
  set :root, ROOT_DIR
  set :views, settings.root + "/app/views"
  set :static, true
end
