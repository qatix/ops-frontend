let audioBD = new Audio()

export default function (text, token, cuid) {
  let src = '//tts.baidu.com/text2audio?ie=UTF-8&lan=zh&&ctp=1&spd=3&pit=&vol=15&per=0';
  src += '&tok=' + token;
  src += '&tex=' + text;
  src += '&cuid=' + cuid;

  audioBD.src = src;
  audioBD.load();
  audioBD.currentTime = 0;
  audioBD.play()
}
