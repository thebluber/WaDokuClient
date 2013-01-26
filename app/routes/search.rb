class WadokuSearchClient < Sinatra::Base

  get "/entries/by-daid/:daid" do 
    response = RestClient.get settings.api_host + "/api/v1/entry/#{params[:daid]}"
    @entry = Yajl::Parser.parse(response)
    @entry_template ||= open(File.join(ROOT_DIR, "public/entry.mustache")).read
    erb :entry
  end

  get "/" do
    if params[:query]
      params[:format] = "html"
      response = RestClient.get settings.api_host + "/api/v1/search", {params: params}
      @parsed = Yajl::Parser.parse(response)
      @entries = @parsed["entries"]
      @query = params[:query]
      puts infolog(response, @entries) if ENV["RACK_ENV"] == "development"
      @offset = @parsed["offset"].to_i
      @more = @parsed["total"].to_i > ((@offset / 30) + 1) * 30
      @total = @parsed["total"]
      @next_page = "/?query=#{@query}&offset=#{@offset + 30}"
      @entries ||= []
      @offset ||= 0
      @total ||= 0
      @entry_template ||= open(File.join(ROOT_DIR, "public/entry.mustache")).read
      erb :index
    else
      erb :start
    end
  end

  helpers do
    def render_entry entry
      @template ||= open(File.join(ROOT_DIR, "public/entry.mustache")).read
      Mustache.render(@template, entry)
    end

    def infolog response, entries
      puts "Entries: #{entries.count}"
    end
  end
end
