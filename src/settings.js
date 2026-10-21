const $ = (id) => document.getElementById(id);

async function init() {
  const options = await window.vrmApp.getOptions();
  $('background').value = options.background;
  $('chroma').value = options.chromaColor;
  $('fps').value = String(options.fps);
  $('frame').checked = options.frame;
}

$('load').addEventListener('click', async () => {
  try {
    const name = await window.vrmApp.chooseModel();
    if (name) $('modelStatus').textContent = `読み込み要求済み: ${name}`;
  } catch (err) {
    $('modelStatus').textContent = `選択に失敗: ${err?.message ?? String(err)}`;
  }
});

$('apply').addEventListener('click', async () => {
  const options = {
    background: $('background').value,
    chromaColor: $('chroma').value,
    fps: Number($('fps').value),
    frame: $('frame').checked
  };
  try {
    const result = await window.vrmApp.setOptions(options);
    $('status').textContent = '設定を反映しました（再起動後の保持は未実装）';
    $('fps').value = String(result.fps);
  } catch (err) {
    $('status').textContent = `設定の反映に失敗: ${err?.message ?? String(err)}`;
  }
});

init().catch((err) => { $('status').textContent = `設定の取得に失敗: ${err?.message ?? String(err)}`; });
