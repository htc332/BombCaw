const canvas = cc.director.getScene().getChildByName('Canvas');
if (canvas) {
  const gameRoot = canvas.getChildByName('GameRoot');
  if (gameRoot) {
    const uiLayer = gameRoot.getChildByName('uiLayer');
    if (uiLayer) {
      const uiMgr = gameRoot.getComponent('UIManager');
      if (uiMgr) {
        uiMgr.scoreLabel = uiLayer.getChildByName('scoreLabel')?.getComponent(cc.Label) || null;
        uiMgr.bombsLeftLabel = uiLayer.getChildByName('bombsLeftLabel')?.getComponent(cc.Label) || null;
        uiMgr.levelInfoLabel = uiLayer.getChildByName('levelInfoLabel')?.getComponent(cc.Label) || null;
        uiMgr.victoryPanel = uiLayer.getChildByName('victoryPanel') || null;
        uiMgr.gameOverPanel = uiLayer.getChildByName('gameOverPanel') || null;
        uiMgr.resetButton = uiLayer.getChildByName('resetButton')?.getComponent(cc.Button) || null;
        uiMgr.nextLevelButton = uiLayer.getChildByName('nextLevelButton')?.getComponent(cc.Button) || null;
        console.log("[Fix] UIManager references bound");
      }
      const scoreMgr = gameRoot.getComponent('ScoreManager');
      if (scoreMgr) {
        scoreMgr.scoreLabel = uiLayer.getChildByName('scoreLabel')?.getComponent(cc.Label) || null;
        scoreMgr.comboLabel = uiLayer.getChildByName('comboLabel')?.getComponent(cc.Label) || null;
        scoreMgr.floatingTextContainer = uiLayer.getChildByName('floatingTextContainer') || null;
        console.log("[Fix] ScoreManager references bound");
      }
      console.log("[Fix] All references updated successfully");
    } else {
      console.log("[Error] uiLayer not found");
    }
  } else {
    console.log("[Error] GameRoot not found");
  }
} else {
  console.log("[Error] Canvas not found");
}
