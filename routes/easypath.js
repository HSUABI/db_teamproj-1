const express = require('express');
const router = express.Router();
const connection = require('./db');
const Console = console;

router.get('/', (req, res, next) => {
  const { session } = req;
  const sql = `SELECT * FROM REALLY_FINAL_DB.TBL_EASYPATH_INFO`;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      //error handling plz
    } else {
      res.render('../views/easypath/index', { session, easypath : results});
    }
  });
});

router.get('/show/:id', (req, res, next) => {
  const { session } = req;
  const { id } = req.params;
  console.log(id); 
  const sql_easy = `SELECT * FROM REALLY_FINAL_DB.TBL_EASYPATH_INFO WHERE (easypath_id = ?)`
  const requirements_easy = [id];
  const sql_user = `SELECT username, email FROM REALLY_FINAL_DB.TBL_USER_INFO WHERE (user_id = ?)`
  const sql_specific = `SELECT * FROM REALLY_FINAL_DB.TBL_EASYPATH_SPECIFIC_INFO WHERE (easypath_id = ?) ORDER BY specific_num`
  const requirements_specific = [id];

  connection.query(sql_easy, requirements_easy, (error, results, fields) => {
    // console.log("about study" + results);
    const easypath = results[0];
    const requirements_user = [easypath.user_id];
    if (error) {
      // error handling plz
    } else {
      
      connection.query(sql_user, requirements_user, (error, results2, fields) => {
        if (error) {
          // error handling plz
        } else {
          const writer = results2[0];
          
          connection.query(sql_specific, requirements_specific, (error, results3, fields) => {
            if (error) {
              console.log(error);
            }
            const specific = results3;
            // console.log("Specific is " + JSON.stringify(specific));
            res.render('../views/easypath/show', { session , easypath, writer, specific: results3 });
          })
          // console.log("about user" + results2);
          
        }
      })
    }
  })

});

router.get('/new', (req, res, next) => {
  const { session } = req;
  res.render('../views/easypath/new', { session });
});

router.post('/create', (req, res, next) => {
  console.log(req.body);
});

router.get('/posts/search', (req, res, next) => {
  var searchWord = req.param('searchWord');
  var searchCategory = req.param('searchCategory');

  //consol.log는 printf같아서 디버깅하면댐
  //console.log(searchCategory);

  //if else문에는 sql 작성을하는데 변수는${} 식으로해서 넣음
  if(searchCategory=='author')
  {
  	var sql = `SELECT * FROM REALLY_FINAL_DB.TBL_EASYPATH_INFO WHERE user_id = (SELECT user_id FROM REALLY_FINAL_DB.TBL_USER_INFO WHERE username = '${searchWord}');`;
  	console.log(sql);
  }
  else
  {
  	var sql = `SELECT * FROM REALLY_FINAL_DB.TBL_EASYPATH_INFO
	WHERE easypath_title LIKE '%${searchWord}%'
	UNION SELECT *
	FROM REALLY_FINAL_DB.TBL_EASYPATH_INFO
	WHERE easypath_content LIKE '%${searchWord}%';`
	console.log(sql)

  }

  //이부분이 sql보내는부분  정우는 requirement가들어갓는데 난오류떠서 뺴버렷음
  connection.query(sql,(error, results, fields) => {
    if (error) {//에러가뜨면 이쪽을실행함
      Console.log('error is' + error);
      res.write("<script language=\"javascript\">alert('unknown input')</script>");	//alert는알림띄우는거
      res.write("<script language=\"javascript\">window.location=\"/easypath\"</script>");
      res.end();
    } else { //성공하면 이걸실행함 result에 쿼리결과가들어감
      console.log('\nStudy_query success');
      console.log(results);
      res.redirect('/easypath')

    }
  })


}) 


module.exports = router;
