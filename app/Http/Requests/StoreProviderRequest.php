<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProviderRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name is required',
            'name.string' => 'The name must be a string',
            'name.max' => 'Maximum 255 characters',
            'description.string' => 'The description must be a string'
        ];
    }
}
