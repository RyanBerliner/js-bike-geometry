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

  kindaFork() {
    return {
      topX: this.headTubeTop.x,
      topY: this.headTubeTop.y,
      bottomX: this.frontAxle.x,
      bottomY: this.frontAxle.y
    }
  }

  /**
   * Pushes the front axle in the direction of the units. Adjusts every other
   * point accordingly except for the rear axle.
   * @param  {[type]} units amount to move the front axle forward
   *                        (- goes backwards)
   *                        (in percetages, same units as others)
   * @return {[type]}       [description]
   */
  slackFork(units) {
    let kindaForkLength = this.getKindaForkLength();
    let initialAngle = this.getKindaForkAngle();
    this.frontAxle.x += units;
    // let a = this.headTubeTop.x - this.frontAxle.x;
    // let newStack = Math.sqrt(Math.pow(kindaForkLength, 2) - Math.pow(a, 2));
    // this.headTubeTop.y = this.frontAxle.y + newStack;
  }

  /**
   * This is the distance from the front axle to the TOP of the headtube,
   * @param  {[type]} toString [description]
   * @return {[type]}          [description]
   */
  getKindaForkLength() {
    let a = this.frontAxle.x - this.headTubeTop.x;
    let b = this.headTubeTop.y - this.frontAxle.y;
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  getKindaForkAngle() {
    let adjacent = this.frontAxle.x - this.headTubeTop.x;
    let hypotenuse = this.getKindaForkLength();
    let angleRad = Math.acos(adjacent/hypotenuse);
    return angleRad * 180 / Math.PI;
  }

  toString() {
    return "Bike to string";
  }

}

export default Bike;
