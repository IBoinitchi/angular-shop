import { Pipe, PipeTransform } from "@angular/core";
import { Product } from "./interfaces";
@Pipe({
  name: "search",
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(products: Product[], productName: string = ""): any {
    if (!productName.trim()) {
      return products;
    }

    return products.filter((product) => {
      return product.title.toLowerCase().includes(productName.toLowerCase());
    });
  }
}
