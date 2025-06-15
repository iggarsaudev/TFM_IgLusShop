<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
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
            'product_id' => 'required|integer|exists:products,id',
            'comment' => 'string|max:255',
            'rating' => 'required|integer|min:0|max:5',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'The product ID is required.',
            'product_id.integer' => 'The product ID must be an integer.',
            'product_id.exists' => 'The selected product does not exist.',
            'comment.string' => 'The comment must be a string.',
            'comment.max' => 'The comment may not be greater than 255 characters.',
            'rating.required' => 'The rating is required.',
            'rating.integer' => 'The rating must be an integer.',
            'rating.min' => 'The rating must be at least 0.',
            'rating.max' => 'The rating may not be greater than 5.',
        ];
    }
}
