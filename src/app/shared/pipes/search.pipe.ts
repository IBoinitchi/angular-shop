import { Pipe, PipeTransform } from "@angular/core";
import { Product } from "../models/interfaces";
@Pipe({
  name: "search",
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(products: Product[], productName: string = ""): Product[] {
    if (!productName.trim()) {
      return products;
    }

    return products.filter((product: Product) => {
      return product.title.toLowerCase().includes(productName.toLowerCase());
    });
  }
}
