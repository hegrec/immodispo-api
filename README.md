<h2>Immodispo API server</h2>

This repo runs the Immodispo API Server



1. First install the immodispo-vm (<a href="https://github.com/hegrec/immodispo-vm">https://github.com/hegrec/immodispo-vm</a>)


Your folder structure should look like this:
<br><br>
<div>/immodispo/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;/immodispo-vm/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vagrantfile and other files are here</div>



1. Clone this repo (immodispo-api) under the /immodispo/ folder
2. On your host machine, navigate to the immodispo-api folder and run <i>npm install</i> (This may require sudo)
1. Navigate to your immodispo-vm folder on your host machine
2. <i>vagrant ssh</i> to connect to the VM
3. <i>cd /vagrant/immodispo-api<i>
4. <i>node index.js</i>
5. The API application will connect to the database within the VM and be available on the host at <a href="http://localhost:3001">http://localhost:3001</a>