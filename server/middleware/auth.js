import jwt from "jsonwebtoken";

const auth = (req) => {
  try {
    // console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_KEY);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default auth;
