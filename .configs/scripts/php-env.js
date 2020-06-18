const path = require('path')
const fs = require('fs')

const file = path.resolve(__dirname, '../', '../', 'env.php')
const nodeEnvironment = -1 < process.argv.indexOf('production') ? 'production' : 'development'

let phpContent = `<?php
$node_environment = '${nodeEnvironment}';
`

fs.writeFileSync(file, phpContent)
