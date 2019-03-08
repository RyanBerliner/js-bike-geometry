class Bike {

  constructor(dimensions) {
    this.frontAxle = {x: dimensions.fAxleX, y: dimensions.axlesY};
    this.rearAxle = {x: dimensions.rAxleX, y: dimensions.axlesY};
    this.bb = {x: dimensions.bbX, y: dimensions.bbY};
    this.saddle = {x: dimensions.saddleX, y: dimensions.saddleY};
    this.headTubeTop = {x: dimensions.htTopX, y: dimensions.htTopY};
    this.headTubeBottom = {x: dimensions.htBottomX, y: dimensions.htBottomY};
    this.groundLevel = dimensions.groundY;
  }

  effectiveSeatTube() {
    return {
      topX: this.saddle.x,
      topY: this.saddle.y,
      bottomX: this.bb.x,
      bottomY: this.bb.y
    }
  }

  headTube() {
    return {
      topX: this.headTubeTop.x,
      topY: this.headTubeTop.y,
      bottomX: this.headTubeBottom.x,
      bottomY: this.headTubeBottom.y
    }
  }

  toString() {
    return "Bike to string";
  }

}

export default Bike;
