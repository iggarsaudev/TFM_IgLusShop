<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'has_discount' => 'declined',
            'discount' => 'numeric|size:0',
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
            'has_discount.declined' => 'The has_discount field must be false or "off".',
            'discount.numeric' => 'The discount must be a number.',
            'discount.size' => 'The discount must be exactly 0.',
            'category_id.required' => 'The category ID is required.',
            'category_id.integer' => 'The category ID must be an integer.',
            'category_id.exists' => 'The selected category does not exist.',
            'provider_id.required' => 'The provider ID is required.',
            'provider_id.integer' => 'The provider ID must be an integer.',
            'provider_id.exists' => 'The selected provider does not exist.',
        ];
    }
}
