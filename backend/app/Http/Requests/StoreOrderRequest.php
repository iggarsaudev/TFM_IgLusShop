<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id', // obligatorio, el valor debe existir en la tabla products en la columna id
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Products are required',
            'items.array' => 'Must be an array of products',
            'items.min' => 'Minimum 1 item',
            'items.*.product_id.required' => 'Each item must have one product',
            'items.*.product_id.exists' => 'The product must exist',
            'items.*.quantity.required' => 'The quantity is required',
            'items.*.quantity.integer' => 'The quantity must be an integer',
            'items.*.quantity.min' => 'There must be a minimum quantity of 1'
        ];
    }
}
