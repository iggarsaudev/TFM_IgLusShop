<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Gets the authenticated user
     * 
     * @OA\Get(
     *     path="/api/user",
     *     summary="Get the authenticated user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Authenticated user",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Not authenticated"
     *     )
     * )
     */
    public function index(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Register a new user
     * 
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register a new user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string", example="Ignacio"),
     *             @OA\Property(property="email", type="string", format="email", example="ejemplo@correo.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Successfully registered user",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Successfully registered user")
     *         )
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="The email is already registered"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation errors",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     )
     * )
     */
    public function register(RegisterUserRequest $request)
    {
        $emailRepetido = User::where('email', $request->email)->first();
        if ($emailRepetido) {
            return response()->json(['error' => 'The email is already registered'], 409);
        }

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user'
        ]);

        return response()->json([
            'message' => 'Successfully registered user'
        ], 201);
    }

    /**
     * Login
     * 
     * @OA\Post(
     *     path="/api/login",
     *     summary="Login a user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="ejemplo@correo.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful login",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Successful login"),
     *             @OA\Property(property="token", type="string", example="1|abc123..."),
     *             @OA\Property(property="expires_at", type="string", example="2025-07-01 12:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials"
     *     )
     * )
     */
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $tokenName = $user->role === 'admin' ? 'admin-token' : 'api-token';
        $tokenResult = $user->createToken($tokenName);
        $token = $user->tokens()->latest()->first();

        $token->expires_at = Carbon::now()->addMinutes(60);
        $token->save();

        return response()->json([
            'message' => 'Successful login',
            'token' => $tokenResult->plainTextToken,
            'expires_at' => $token->expires_at,
        ], 200);
    }

    /**
     * Renew the current token
     * 
     * @OA\Post(
     *     path="/api/token/renew",
     *     summary="Renew the current access token",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="New token generated",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", example="1|newtoken..."),
     *             @OA\Property(property="expires_at", type="string", example="2025-07-01 13:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function renewToken(Request $request)
    {
        $user = $request->user();

        $request->user()->currentAccessToken()->delete();

        $tokenName = $user->role === 'admin' ? 'admin-token' : 'api-token';
        $tokenResult = $user->createToken($tokenName);
        $token = $user->tokens()->latest()->first();

        $token->expires_at = Carbon::now()->addMinutes(60);
        $token->save();

        return response()->json([
            'token' => $tokenResult->plainTextToken,
            'expires_at' => $token->expires_at,
        ]);
    }

    /**
     * Logout
     * 
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Logout the authenticated user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successfully logged out",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Successfully logged out")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
