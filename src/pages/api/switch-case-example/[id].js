/* 
The index.js file can be called index.js if you don't want to have a dynamic route.
The dynamic rout require a parameter in the URL:
like localhost/PORT/switch-case-example/PARAMETER
Otherwise, it won't work. 

Nested parameters work just as they work in the pages (using nested folders or [...id]). 
Nested folders require lots of files, but if you use [...<nameOfTheParam>] you can destructure multiple params
with:
    const { params } = req.query;
    const [param1, param2, etc] = params;
and then access them easily with the name of each param, as they are all a new const.
For example, if you want to see those params in the endpoint (which makes no sense, but
we'll do it for learning purposes) you can use
    res.json({ param 1: param1, param 2: param2 });

*/

export default function handler(req, res) {
  /*
    The method should return a GET method if we are not using a different one. 
    The query returns the params. In this case the only parameter is "id", so 
    you can get the param with query.id to get only the id and not the json array. 
    */
  const { method, query } = req;
  console.log(method, query.id);

  switch (method) {
    case "GET":
      res.status(200).json({ message: "You are in the get method" });
      break;
    case "POST":
      // POST data
      res.status(200).json({ response: "POST successful" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      /* 
            This status a message if someone is using a not allowed method 
            (not listed in the Allow header)
            */
      res.status(405).end(`Method ${method} not allowed`);
  }
}
