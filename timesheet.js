const process = require("process");
const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');
const moment = require("moment");

const EXECUTED_AT = new Date();
const argv = yargs(hideBin(process.argv)) . argv;

//variabile pt functii
const action = argv._.shift();
const args = argv._;
const project = argv.p || '';
const log_date = function(){
  const date = moment(EXECUTED_AT).format('YYYY-MM-DD HH:mm:ss [W]WW');
  return `[${date}]`;
}

function message(all_projects) {

  if(action == 'pause'){

    if(args.length > 0){
      throw new Error(`Nu scrie nimic după "pause"`);
    }

    return {
      to_log: `${log_date()} PAUSE "Am luat pauză!"\n`,
      to_show: `${log_date()} Am intrat în pauză!`,
    };
  }

  if(action == 'doing'){
    return doing(all_projects);
  }

  throw new Error(`Trebuie să pui "pause" sau "doing".`);
}

function doing(all_projects){

  if(args.length < 1){
    throw new Error("Daca faci ceva, zi ce faci!");
  }

  const joined_args = args.join(' ').trim();
  const msg = joined_args.charAt(0).toUpperCase() + joined_args.slice(1);

  if(project){

    if(!(project in all_projects)){
      if(typeof process.env.CLOCKING_PROJECTS == "string"){
        throw new Error(`Nu există proiectul "${project}"!\nModifică ${process.env.CLOCKING_PROJECTS}`);
      }

      throw new Error(`Nu ai creat inca proiecte! Adauga variabila "CLOCKING_PROJECTS" in ".bashrc"`);
    }

    const project_name = all_projects[project];
    const first_line = `Pe proiectul "${project_name}"\n`;

    return {
      to_log: `${log_date()} DOING ${project} "${msg}"\n`,
      to_show: `${first_line}${log_date()} Lucrez la proiectul(${project}). Ce fac: ${msg}`,
    };
  }

  return {
    to_log: `${log_date()} DOING "${msg}"\n`,
    to_show: `${log_date()} Lucrez la ceva: ${msg}`, 
  }

}


module.exports = message;