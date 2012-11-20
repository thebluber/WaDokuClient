require "bundler"

Bundler.require

ROOT_DIR = File.expand_path(File.dirname(__FILE__))

require_relative 'config/api_server'
require_relative 'app/routes/search'
