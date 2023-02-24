/*
log를 사용하기 위하여 제작한 js파일 
Winston은 level에 따라 사용자가 직접 로그 남기는 것이 가능한 라이브러리 
*/
const winston = require('winston');
require('winston-daily-rotate-file');
const logDir = '../logs';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
}

const level = () => {
	const env = process.env.NODE_ENV || 'development'
	const isDevelopment = env === 'development'
	return isDevelopment ? 'debug' : 'warn'
}

//색상 설정 
const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'blue', 
}

winston.addColors(colors); //위에서 설정한 색상을 추가해야지 정상작동함

//log 출력및 format 바꾸기 
const format = winston.format.combine( //log표시 형식을 바꾼다 
	winston.format.timestamp({format: ' YYYY-MM-DD HH:MM:SS ||'}), //타임스탬프 표시
	winston.format.colorize({all: true}), //log를 직관전이게 하려고 색상 추가 
	winston.format.printf( //출력
		(info) => `${info.timestamp} [ ${info.level} ] > ${info.message}`,
	),
)

//log 생성 
const logger = winston.createLogger({
	format,
	level: level(),
	transports: [
		new winston.transports.DailyRotateFile({
			level: 'info', //일반 log
			datePattern: 'YYYY-MM-DD', //타임스탬프 
			dirname: logDir, //저장위치 
 			filename: `%DATE%.log`, //저장 이름
			zippedArchive: true, //압축 여부 확인 
			handleExceptions: true, //예외 처리 아마도(지피티가 말해줌)
			maxFiles: 30, //최대 몇일까지 저장 할지 정하는 파라미터
		}),
		new winston.transports.DailyRotateFile({
			level: 'error', //에러 log
			datePattern: 'YYYY-MM-DD', //타임스탬프
			dirname: logDir + '/error', //저장위치 
			filename: `%DATE%.error.log`, //저장 이름 
			zippedArchive: true, //압축 여부 확인 
			maxFiles: 30, //최대 몇일까지 젖아 할지 정하는 파라미터 
		}),
		new winston.transports.Console({
			handleExceptions: true, //예외 처리 아마도(지피티가 말해줌)
		})
	]
});

module.exports = logger;