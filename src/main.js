import Strs from './strings.js'

// Read Arguments, if there weren't, activate prompts mode, or else arg parsing mode.

// Help:
if (process.argv.includes('--help') || process.argv.includes('-h')) {
	process.stdout.write(Strs.help_text)
}

// prompts_mode:
else if (process.argv.length === 2) {
	// parsing_table for input contents
	const parsing_table = new Map()
}

// arg_parsing_mode:
else {
	// Parsing table for CLI args
	const parsing_table = new Map()
	// Parse args
	process.argv.reduce((prev, curr, idx, argv) => {
		// Ignore the first 2 args to prevent from possible unexpected bugs
		if (idx < 2) return ''
		// Discuss if the previous arg is a tag
		if (prev.startsWith('--')) {
			// Two tag should not be juxtaposed
			if (curr.startsWith('-')) {
				throw new Error(Strs.err_juxtaposed_two_tags)
			} else {
        parsing_table.set(prev.replace('--', '').toLowerCase(), curr)
      }
		} else if (prev.startsWith('-') && prev.length === 2) {
      // Two tag should not be juxtaposed
      if (curr.startsWith('-')) {
				throw new Error(Strs.err_juxtaposed_two_tags)
			} else {
        prev = prev
          .toLowerCase()
          .replace('-n', 'name')
          .replace('-d', 'desc')
          .replace('-l', 'lang')
          .replace('-v', 'vers')
          .replace('-e', 'entr')
          .replace('-a', 'auth')
          .replace('-u', 'uuid')
        parsing_table.set(prev, curr)
      }
		}
		return curr
	})
  if (!parsing_table.has('name')) {
    throw new Error(Strs.no_pack_name)
  }
  build(parsing_table)
}

function build(parsing_table) {
  
}
