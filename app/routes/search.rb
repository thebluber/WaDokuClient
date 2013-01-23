class WadokuSearchClient < Sinatra::Base
  get "/" do

    if params[:query]
      params[:format] = "html"
      response = RestClient.get settings.api_host + "/api/v1/search", {params: params}
      @parsed = Yajl::Parser.parse(response)
      @entries = @parsed["entries"]
      @query = params[:query]
      puts infolog(response, @entries) if ENV["RACK_ENV"] == "development"
    end

    @entries ||= []
    @offset = @parsed["offset"].to_i
    @more = @parsed["total"].to_i > ((@offset / 30) + 1) * 30
    @next_page = "/?query=#{@query}&offset=#{@offset + 30}"
    erb :index
  end

  helpers do
    def infolog response, entries
      puts "Entries: #{entries.count}"
    end
  end
end
