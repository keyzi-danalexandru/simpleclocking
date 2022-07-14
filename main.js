const process = require("process");
const fs = require("fs").promises;
const os = require("os");
const timesheet = require("./timesheet");

const DEFAULT_CLOCKING_FILE_NAME = '.clocking.log';

async function getFile(){
  let data_file = process.env.CLOCKING_FILE;

  if(!data_file){
    data_file = os.homedir() + '/' + DEFAULT_CLOCKING_FILE_NAME;
  }

  return fs.open(data_file,'a+');
}

/**
 * @param {fs.FileHandle} file da
 */
async function writeTime(file, msg){
  return file.write(msg);
}

getFile().then(x => {

  let projects = {};

  if(typeof process.env.CLOCKING_PROJECTS == "string"){
    projects = require(process.env.CLOCKING_PROJECTS);
  }

  try{
    const astea = timesheet(projects);

    writeTime(x, astea.to_log).then(ok => {
      console.log(astea.to_show);
    });

  }catch(err){
    console.error(err.toString());
  }
});