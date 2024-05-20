// 오류 처리 미들웨어
const errorHandler = (error, req, res, next) => {
    
    console.error(error); // 에러를 로깅합니다.
    res.status(500).json({ errorMessage: '서버 오류가 발생했습니다.' }); // 클라이언트에게 오류 응답을 보냅니다.
};

export default errorHandler;