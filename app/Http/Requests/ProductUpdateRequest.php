<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
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
            'name' => 'sometimes|string|min:3',
            'description' => 'sometimes|string|max:255',
            'price' => 'sometimes|decimal:0,2',
            'stock' => 'integer',
            'image' => 'url',
            'has_discount' => 'boolean',
            'discount' => 'sometimes|numeric|gte:0|lte:100',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'provider_id' => 'sometimes|integer|exists:providers,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'The name must be a string.',
            'name.min' => 'The name must be at least 3 characters.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 255 characters.',
            'price.decimal' => 'The price must be a valid decimal with up to 2 decimal places.',
            'stock.integer' => 'The stock must be an integer.',
            'image.url' => 'The image must be a valid URL.',
            'has_discount.boolean' => 'The has_discount field must be true or false.',
            'discount.numeric' => 'The discount must be a number.',
            'discount.gte' => 'The discount must be at least 0.',
            'discount.lte' => 'The discount may not be greater than 100.',
            'category_id.integer' => 'The category ID must be an integer.',
            'category_id.exists' => 'The selected category does not exist.',
            'provider_id.integer' => 'The provider ID must be an integer.',
            'provider_id.exists' => 'The selected provider does not exist.',
        ];
    }
}
