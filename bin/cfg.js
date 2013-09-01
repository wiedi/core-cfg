#!/usr/bin/env node
"use strict"

var fs = require('fs')
var program = require('commander')
var libcfg = require('../lib/main')

program
	.version("0.0.1")
	.usage('[template-dir]')
	.option('-d, --destination <path>', 'Write processed templates relative to <path> [/]', '/')
	.option('-t, --template <file>',    'Process only <file> and write output to stdout')
	.parse(process.argv)


if(program.args.length < 1 && !program.template) {
	program.help()
}

libcfg.read_stdin(function(context) {
	/* only process one file and write the output to stdout */
	if(program.template) {
		var template = fs.readFileSync(program.template, {encoding: "utf-8"})
		console.log(libcfg.apply_context(template, context))
		return
	}

	libcfg.deploy_config(program.args[0], program.destination, context)
})
