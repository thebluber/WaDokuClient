class WadokuSearchClient < Sinatra::Base
  get "/" do

    if params[:query]
      response = RestClient.get settings.api_host + "/api/v1/search", {params: params}
      @entries = Yajl::Parser.parse(response)["entries"]
    end

    @entries ||= []
    erb :index
  end
end
