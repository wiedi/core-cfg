#!/usr/bin/env node
"use strict"

var program = require('commander')
var libcfg = require('../lib/main')

program
	.version("0.0.1")
	.usage('<keys...>')
	.option('-i, --stdin', 'Read JSON from stdin')
	.parse(process.argv)

function print_result(err, result) {
	if(err) {
		process.stderr.write(err)
		console.log(JSON.stringify({}))
		return
	}
	console.log(JSON.stringify(result))
}

if(program.stdin) {
	libcfg.read_stdin(function(context) {
		libcfg.merge_facts(program.args, context, print_result)
	})
} else {
	libcfg.merge_facts(program.args, {}, print_result)
}
