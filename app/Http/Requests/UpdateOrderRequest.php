<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
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
            'status' => 'required|in:pending,sent,cancelled,delivered'
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'The status is required',
            'status.in' => 'The status must be pending|sent|cancelled|delivered'
        ];
    }
}
