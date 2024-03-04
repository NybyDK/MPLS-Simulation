export default class Packet {
	constructor(
		public source: string,
		public destination: string,
		public label: number,
		public ttl: number = 32,
	) {}
}
