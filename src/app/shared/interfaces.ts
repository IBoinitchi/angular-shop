export interface Product {
	id?: string
	type?: string
	title?: string
	photo?: string
	info?: string
	price?: string
	date?: Date
}

export interface Order {
	id?: string
	name?: string
	phone?: string
	payment?: string
	address?: string
	price?: number
	products: Product[]
	date?: Date
}

export interface FirebaseResponse {
	name: string
}
