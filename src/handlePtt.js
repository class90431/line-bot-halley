const boards = require('./static/ptt_boards')
const ptt_crawler = require('./plugins/ptt_crawler')

main()
async function main(){
	let board, pages, ptt
	//  initaialize
	await ptt_crawler.initialize();
	// get result
    board = 'Lifeismoney'
    pages = 1
	ptt = await ptt_crawler.getResults({
		board: board,
		pages: pages,
		skipPBs: true,
		getContents: true
	})
	consoleOut(board, pages, ptt);
	// close
	await ptt_crawler.close();
}
// consoleOut
function consoleOut(_scrapingBoard, _scrapingPages, ptt) {	
	console.log('-----------------------------');
	console.log('Board Name = ' + _scrapingBoard);
	console.log('ScrapingPages = ' + _scrapingPages);
	console.log('Total Items = ' + ptt.titles.length + '\n-----------------------------');

	for (let i = 0; i < ptt.titles.length; i++) {
		console.log(
			ptt.rates[i] + ' 推 | ' + ptt.titles[i] + ' | 日期:' + ptt.dates[i] +
			' | ' + ptt.authors[i] + ' | ' + ptt.urls[i]
		);
	}
}