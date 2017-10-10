# faceapp.rb
require 'rubygems'
require 'bundler'
require 'ostruct'
Bundler.require
# require "sinatra/base"
# require "sinatra/reloader"

# Load up all our secrets
Dotenv.load

# Set up our AWS authentication for all calls in this app
Aws.config.update({
        :region => 'us-east-1',
        :credentials => Aws::Credentials.new(ENV['AWS_KEY'],ENV['AWS_SECRET'])
    })

# Default collection name
FACE_COLLECTION = "faceapp_test"
set :bind, '0.0.0.0'
# set :environment, :development

# The routes
get '/' do
  # Show the main index page
  pid = spawn('python public/python/test.py --colour blue')
  Process.detach(pid)
  erb :faceapp
end


post '/upload/:photoid' do
  client = Aws::Rekognition::Client.new()
  response = client.index_faces({
    collection_id: FACE_COLLECTION,
    external_image_id: params[:photoid],
    image: {
      bytes: request.body.read.to_s
    }
  })
  "Image uploaded safely!"
end


post '/compare' do

  #tries to access python script to operate the matrix
  begin
    pid = spawn('python public/python/test.py --colour blue')
    Process.detach(pid)
  rescue Exception => e
    puts e.message
  end

  content_type :json
  client = Aws::Rekognition::Client.new()
  snsClient = Aws::SNS::Client.new()
  response = ''
  snsResponse = ''
  begin
    response = client.search_faces_by_image({
      collection_id: FACE_COLLECTION,
      max_faces: 1,
      face_match_threshold: 95,
      image: {
        bytes: request.body.read.to_s
      }
    })
  rescue Aws::Rekognition::Errors::InvalidParameterException => e
    puts e.message
    response = OpenStruct.new(:face_matches => [], :facecount => 0)
    puts response.face_matches
  rescue Aws::Rekognition::Errors::ValidationException => e
    puts e.message
    response = OpenStruct.new(:face_matches => [], :facecount => 0)
  end

  if response.face_matches.count > 1
    {:message => "Too many faces found"}.to_json

  elsif response.face_matches.count == 0 && response.respond_to?('facecount')
    {:id => "0", :message => "No faces"}.to_json
  elsif response.face_matches.count == 0 && !response.respond_to?('facecount')
    {:id => "UNRECOGNIZED", :message => "UNRECOGNIZED FACE"}.to_json

    #tries to access python script to operate the matrix
    begin
      pid = spawn('python public/python/test.py --colour red')
      Process.detach(pid)
    rescue Exception => e
      puts e.message
    end
  else
    # "Comparison finished - detected #{ response.face_matches[0].face.external_image_id } with #{ response.face_matches[0].face.confidence } accuracy."
    snsResponse = snsClient.publish({
                                        phone_number: "+573154156033",
                                        message: "Hello, this is the LucIAna service, announcing that " + response.face_matches[0].face.external_image_id + " has entered the premises"
                                    })
    snsResponse = snsClient.publish({
                                        phone_number: "+573176379772",
                                        message: "Hello, this is the LucIAna service, announcing that " + response.face_matches[0].face.external_image_id + " has entered the premises"
                                    })
    {:id => response.face_matches[0].face.external_image_id, :confidence => response.face_matches[0].face.confidence, :message => "Face found!"}.to_json

    #tries to access python script to operate the matrix
    begin
      pid = spawn('python public/python/test.py --colour green')
      Process.detach(pid)
    rescue Exception => e
      puts e.message
    end
  end
end


post '/speech' do
  client = Aws::Polly::Client.new()
  response = client.synthesize_speech({
    output_format: "mp3",
    voice_id: "Joanna",
    text: params[:tosay]
  })
  Base64.encode64(response.audio_stream.string)
end


get '/collection/:action' do
  client = Aws::Rekognition::Client.new()
  collections = client.list_collections({}).collection_ids
  case params[:action]
    when 'create'
      if !(collections.include? FACE_COLLECTION)
        response = client.create_collection({ collection_id: FACE_COLLECTION })
      end
    when 'delete'
      if (collections.include? FACE_COLLECTION)
        response = client.delete_collection({ collection_id: FACE_COLLECTION })
      end
  end
  redirect '/'
end
