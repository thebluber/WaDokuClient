class WadokuSearchClient < Sinatra::Base
  set :api_host, "127.0.0.1:9292" || ENV["wadoku_api_host"]
  set :root, ROOT_DIR
  set :views, settings.root + "/app/views"
  set :static, true
end
