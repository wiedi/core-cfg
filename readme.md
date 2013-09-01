# core-cfg

minimalistic config templating

## Install

	npm install -g core-cfg

## About

core-cfg installs two programms: <code>cfg</code> and <code>mdata-facts</code>.

## cfg

	Usage: cfg [template-dir]
	
	Options:
	    -d, --destination <path>  Write processed templates relative to <path> [/]
    	-t, --template <file>     Process only <file> and write output to stdout
    
<code>cfg</code> creates configuration files from templates which are filled with data from a json object.
This json object is read from stdin as context.
The context is applied to all template configuration files in <code>template-dir</code> (or a single template file if the <code>-t</code> option is used).
As a template language Handlebars (<http://handlebarsjs.com>) is used.
The complete file tree (including permissions) is reproduced into the destination directory (which by default is /).

## mdata-facts

	Usage: mdata-facts <keys...>
	
	Options:
	    -i, --stdin    Read JSON from stdin

<code>mdata-facts</code> is a small utility to create a cfg context from a SmartOS Zone configuration.


It takes any number of keys as arguments, reads them via mdata-get and produces a JSON object which can be processed by cfg.
When the <code>-i</code> option is used it merges the context with a JSON object read from stdin.

## Examples

	# echo '{"foo": "yes"}' | mdata-facts -i sdc:max_physical_memory sdc:zonename
	{
		"foo": "yes",
		"sdc:max_physical_memory": "512",
		"sdc:zonename": "9402a15e-a6a3-49c9-90a1-910c893c06ed"
	}

	# mdata-facts graphite_host | cfg /opt/cfg/templates/graphite/
