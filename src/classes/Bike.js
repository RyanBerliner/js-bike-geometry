class Bike {

  constructor(dimensions) {
    this.og = dimensions;
    this.frontAxle = {x: dimensions.fAxleX, y: dimensions.axlesY};
    this.rearAxle = {x: dimensions.rAxleX, y: dimensions.axlesY};
    this.bb = {x: dimensions.bbX, y: dimensions.bbY};
    this.saddle = {x: dimensions.saddleX, y: dimensions.saddleY};
    this.headTubeTop = {x: dimensions.htTopX, y: dimensions.htTopY};
    this.headTubeBottom = {x: dimensions.htBottomX, y: dimensions.htBottomY};
    this.groundLevel = dimensions.groundY;
    this.correctDimensions();
  }

  correctDimensions() {
    this.slackFork(0);
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
    let headTubeLength = this.getHeadTubeLength();
    let initialAngle = this.getKindaForkAngle();
    let frontAxle = this.frontAxle;
    let headTubeTop = this.headTubeTop;
    let headTubeBottom = this.headTubeBottom;

    frontAxle.x = this.og.fAxleX + units;
    headTubeTop.y = frontAxle.y - Math.sqrt(Math.pow(kindaForkLength, 2) - Math.pow(frontAxle.x - headTubeTop.x, 2));

    // We've moved the front axle, and top of the head tube. Let find where to put the
    // bottom of the head tube.

    let newAngle = Bike.getAngle(frontAxle, headTubeTop);
    let b = Bike.cosin(newAngle) * headTubeLength;
    let c = Bike.sin(newAngle) * headTubeLength;
    console.log(b, c);

    headTubeBottom.x = headTubeTop.x + b;
    headTubeBottom.y = headTubeTop.y + c;
    // console.log(headTubeBottom.y);

    this.frontAxle = frontAxle;
    this.headTubeTop = headTubeTop;
    this.headTubeBottom = headTubeBottom;
  }

  /**
   * This is the distance from the front axle to the TOP of the headtube,
   * @param  {[type]} toString [description]
   * @return {[type]}          [description]
   */
  getKindaForkLength() {
    return Bike.getDistance(this.frontAxle, this.headTubeTop);
  }

  /**
   * Get the head tube length.
   * @return {[type]} [description]
   */
  getHeadTubeLength() {
    return Bike.getDistance(this.headTubeBottom, this.headTubeTop);
  }

  getKindaForkAngle() {
    return this.getKindaForkAngleManual(this.frontAxle, this.headTubeTop);
  }

  getKindaForkAngleManual(headTubeTop, frontAxle) {
    return Bike.getAngle(headTubeTop, frontAxle);
  }

  static getDistance(point1, point2) {
    let a = point1.x - point2.x;
    let b = point1.y - point2.y;
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  static getAngle(point1, point2) {
    let adjacent = point1.x - point2.x;
    let hypotenuse = Bike.getDistance(point1, point2);
    let angleRad = Math.acos(adjacent/hypotenuse);
    return angleRad;
  }

  static cosin(angle) {
    return Math.cos(angle);
  }

  static sin(angle) {
    return Math.sin(angle);
  }

  toString() {
    return "Bike to string";
  }

}

export default Bike;
