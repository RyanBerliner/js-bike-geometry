class Bike {

  constructor(dimensions) {
    this.frontAxle = {x: dimensions.fAxleX, y: dimensions.axlesY};
    this.rearAxle = {x: dimensions.rAxleX, y: dimensions.axlesY};
    this.bb = {x: dimensions.bbX, y: dimensions.bbY};
    this.saddle = {x: dimensions.saddleX, y: dimensions.saddleY};
    this.headTubeTop = {x: dimensions.htTopX, y: dimensions.htTopY};
    this.headTubeBottom = {x: dimensions.htBottomX, y: dimensions.headTubeBottomY};
    this.groundLevel = dimensions.groundY;
  }

  toString() {
    return "Bike to string";
  }

}

export default Bike;
