const path = require('path');

module.exports = {
	outputDir:path.resolve(__dirname,'../server/dist'),
	devServer: {
		proxy: {
			'/v': {
				target: 'http://localhost:3333',
				ws: true,
				changOrigin: true,
			}
		}
	},
	lintOnSave: false 
};