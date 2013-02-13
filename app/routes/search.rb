class WadokuSearchClient < Sinatra::Base

  before do
    session[:css] ||= params[:css]
    @css = session[:css] || "bootstrap.min"
  end

  get "/entries/by-daid/:daid" do
    response = RestClient.get settings.api_host + "/api/v1/entry/#{params[:daid]}?full_subentries=true"
    @entry = Yajl::Parser.parse(response)
    @entry_template = mustache_template :entry
    erb :entry
  end

  get "/" do
    if params[:query]
      params[:format] = "html"
      params[:full_subentries] = 'true'
      params[:limit] = 15
      response = RestClient.get settings.api_host + "/api/v1/search", {params: params}
      @parsed = Yajl::Parser.parse(response)
      @entries = @parsed["entries"]
      @entries = @entries.each_with_index.map {|e, i| e["odd"] = "odd" if i % 2 == 1 ; e}
      @query = params[:query]
      puts infolog(response, @entries) if ENV["RACK_ENV"] == "development"
      @offset = @parsed["offset"].to_i
      @more = @parsed["total"].to_i > ((@offset / params[:limit]) + 1) * params[:limit]
      @total = @parsed["total"]
      @next_page = "/?query=#{@query}&offset=#{@offset + params[:limit]}"
      @entries ||= []
      @offset ||= 0
      @total ||= 0
      @entry_template = mustache_template :entry
      erb :index
    else
      erb :start
    end
  end

  helpers do

    def mustache_template name
      @@templates ||= {}
      @@templates[name] = File.read(File.join(ROOT_DIR, "app", "views", "#{name}.mustache")) unless @@templates[name]
      @@templates[name]
    end

    def mustache name, obj
      Mustache.render(mustache_template(name), obj)
    end

    def infolog response, entries
      puts "Entries: #{entries.count}"
    end
  end
end
