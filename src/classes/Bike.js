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
    console.log("kinda fork length", kindaForkLength);
    // console.log(this.frontAxle.x);
    let newFrontAxleX = this.frontAxle.x + units;
    let a = Math.sqrt(Math.pow(kindaForkLength, 2) - Math.pow(newFrontAxleX - this.headTubeTop.x, 2));
    let newHeadTubeTopY = this.frontAxle.y - a;
    this.frontAxle.x = newFrontAxleX;
    this.headTubeTop.y = newHeadTubeTopY;
    console.log("front axle x", this.frontAxle.x, newFrontAxleX);
    console.log("head tube top", this.headTubeTop.x, newHeadTubeTopY);
  }

  /**
   * This is the distance from the front axle to the TOP of the headtube,
   * @param  {[type]} toString [description]
   * @return {[type]}          [description]
   */
  getKindaForkLength() {
    let a = this.frontAxle.x - this.headTubeTop.x;
    let b = this.frontAxle.y - this.headTubeTop.y;
    console.log("a", a);
    console.log("b", b);
    let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    console.log("c", c);
    console.log("dimensions", this.frontAxle, this.headTubeTop);
    return c;
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
