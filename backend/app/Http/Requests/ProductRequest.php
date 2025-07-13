<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3',
            'description' => 'required|string|max:255',
            'price' => 'required|decimal:0,2',
            'stock' => 'integer',
            'image' => 'url',
            'has_discount' => 'required|boolean',
            'discount' => [
            'required_if:has_discount,true',
            'numeric',
            'min:0',
            Rule::when(
                $this->input('has_discount') === false,
                ['in:0'], // si no hay descuento, solo se permite 0
                ['lt:100'] // si hay descuento, no puede ser 100 o más
            ),],
            'category_id' => 'required|integer|exists:categories,id',
            'provider_id' => 'required|integer|exists:providers,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.min' => 'The name must be at least 3 characters.',
            'description.required' => 'The description field is required.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 255 characters.',
            'price.required' => 'The price field is required.',
            'price.decimal' => 'The price must be a valid decimal with up to 2 decimal places.',
            'stock.integer' => 'The stock must be an integer.',
            'image.url' => 'The image must be a valid URL.',
            'discount.required_if' => 'If the product has a discount, you must provide a discount value between 1 and 100.',
            'discount.min' => 'The discount must be at least 1%.',
            'discount.max' => 'The discount may not be greater than 100%.',
            'discount.numeric' => 'The discount must be a number.',
            'category_id.required' => 'The category ID is required.',
            'category_id.integer' => 'The category ID must be an integer.',
            'category_id.exists' => 'The selected category does not exist.',
            'provider_id.required' => 'The provider ID is required.',
            'provider_id.integer' => 'The provider ID must be an integer.',
            'provider_id.exists' => 'The selected provider does not exist.',
        ];
    }
}
