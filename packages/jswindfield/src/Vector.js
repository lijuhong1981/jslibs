class Vector {
    constructor(u, v) {
        this.u = u;
        this.v = v;
        this.m = this.magnitude();
    }

    magnitude() {
        return Math.sqrt(this.u * this.u + this.v * this.v);
    }
};

export default Vector;
export { Vector };
