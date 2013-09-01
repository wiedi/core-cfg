"use strict"

var fs            = require('fs')
var path          = require('path')
var child_process = require('child_process')
var mkdirp        = require('mkdirp')
var findit        = require('findit2')
var async         = require('async')
var Handlebars    = require('handlebars')


Handlebars.registerHelper('wtf', function(v) {
	/* debug helper, thx maex ;-) */
	process.stderr.write('wtf: ' +  v + "\n")
})

Handlebars.registerHelper('eq', function(variable, value, block) {
	return (variable == value) ? block.fn(this) : block.inverse(this)
})


function deploy_config(source_path, destination_path, context) {
	var files = findit.sync(source_path, {'relative': true})

	for(var i = 0; i < files.length; i++) {
		var file     = files[i]
		var file_src = source_path      + '/' + file
		var file_dst = destination_path + '/' + file
		var stat = fs.statSync(file_src)

		if(stat.isDirectory()) {
			mkdirp.sync(file_dst, stat.mode)
			continue
		}
		if(!stat.isFile()) {
			continue
		}

		var template = fs.readFileSync(file_src, {encoding: "utf-8"})
		var result = apply_context(template, context)
		fs.writeFileSync(file_dst, result)
		fs.chmodSync(file_dst, stat.mode)
	}
}


function apply_context(template, context) {
	return Handlebars.compile(template)(context)
}


function merge_facts(keys, context, cb) {
	async.mapSeries(keys, mdata_get, function(err, results) {
		if(err) {
			cb(err)
			return
		}
		for(var i = 0; i < results.length; i++) {
			context[keys[i]] = results[i]
		}
		cb(null, context)
	})
}


function mdata_get(key, cb) {
	child_process.execFile("/usr/sbin/mdata-get", [key], {}, function(err, stdout, stderr) {
		if(err) {
			cb(null, "")
			return
		}
		cb(null, stdout.trim())
	})
}


function read_stdin(cb) {
	var data = ""

	process.stdin.setEncoding('utf8')
	process.stdin.resume()

	process.stdin.on('data', function(chunk) {
		data += chunk
	})

	process.stdin.on('end', function() {
		try {
			cb(JSON.parse(data))
		} catch (e) {
			process.stderr.write("Invalid JSON\n")
			cb({})
		}
	})
}

exports.deploy_config = deploy_config
exports.apply_context = apply_context
exports.merge_facts   = merge_facts
exports.mdata_get     = mdata_get
exports.read_stdin    = read_stdin
