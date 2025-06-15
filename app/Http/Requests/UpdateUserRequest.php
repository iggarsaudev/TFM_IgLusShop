<?php

namespace App\Http\Requests;

use App\Exceptions\ResourceNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    protected ?User $userToUpdate = null;

    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        $id = $this->route('user');

        $this->userToUpdate = User::find($id);

        if (!$this->userToUpdate) {
            throw new ResourceNotFoundException('Recurso no encontrado');
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->userToUpdate->id),
            ],
            'password' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|in:user,admin'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.string' => 'Name must be a string',
            'name.max' => 'Maximum 255 characters',
            'email.required' => 'Email is required',
            'email.email' => 'Must be a valid email',
            'email.unique' => 'Email is already taken',
            'password.required' => 'Password is required',
            'password.string' => 'Password must be a string',
            'password.min' => 'Password must be at least 8 characters',
            'role.in' => 'Role must be "user" or "admin"',
        ];
    }
}
