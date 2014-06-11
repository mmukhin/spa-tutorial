<?php

/**
 * Load dependencies
 */
require '../vendor/autoload.php';
require 'models/AbstractModel.php';
require 'models/TeamModel.php';

/**
 * Launch temporary storage
 */
session_start();

/**
 * Start application
 */
$app = new \Slim\Slim();;

/**
 * Allow cross-domain requests (CORS)
 */
$app->response->headers->set('Access-Control-Allow-Origin', '*');

/**
 * Start routing
 */
$app->get('/teams/', function () use ($app) {

    $TeamModel = new TeamModel();
    $app->response()->body( json_encode($TeamModel->fetchAll()) );
});

$app->get('/teams/:id', function ($id) use ($app) {

    $TeamModel = new TeamModel();
    $app->response()->body( json_encode($TeamModel->fetchOne($id)) );
});

$app->put('/teams/:id', function ($id) use ($app) {

    $requestJson = json_decode($app->request()->getBody(), true);

    // Instantiate Team and fill attributes
    $TeamModel = new TeamModel();
    $TeamModel->setId($id)
         ->setCity($requestJson['city'])
         ->setName($requestJson['name']);

    // Update the storage
    if ($TeamModel->update()) {
        $app->response()->body( json_encode($TeamModel->toArray()) );
    }
    else {
        $app->response()->body( json_encode($TeamModel->getError()) );
        $app->response()->status( 400 );
    }
});

$app->delete('/teams/:id', function ($id) use ($app) {

    // Instantiate Team and set id attribute
    $TeamModel = new TeamModel();
    $TeamModel->setId($id);

    // Delete team, respond with error if method returns false
    if ( ! $TeamModel->delete()) {

        $app->response()->body( json_encode($TeamModel->getError()) );
        $app->response()->status( 400 );
    }
});

$app->post('/teams/', function () use ($app) {

    $requestJson = json_decode($app->request()->getBody(), true);

    // Instantiate Team and fill attributes
    $TeamModel = new TeamModel();
    $TeamModel->setCity($requestJson['city'])
         ->setName($requestJson['name']);

    if ($TeamModel->create()) {
        $app->response()->body( json_encode($TeamModel->toArray()) );
    }
    else {
        $app->response()->body( json_encode($TeamModel->getError()) );
        $app->response()->status( 400 );
    }
});

/**
 * Launch application
 */
$app->run();